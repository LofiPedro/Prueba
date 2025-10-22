from datetime import datetime
import secrets

from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user

from . import db
from .models import Appointment, Lead, Message, SessionLog, Team, User


auth_bp = Blueprint('auth', __name__)
main_bp = Blueprint('main', __name__)


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        password = request.form.get('password')
        role = request.form.get('role', 'agent')
        join_code = request.form.get('join_code')

        if not all([full_name, email, password, role]):
            flash('Todos los campos son obligatorios.')
            return render_template('register.html')

        if User.query.filter_by(email=email).first():
            flash('El correo ya está registrado.')
            return render_template('register.html')

        user = User(full_name=full_name, email=email, role=role)
        user.set_password(password)

        if role == 'agent':
            if not join_code:
                flash('Los agentes necesitan un código de equipo para registrarse.')
                return render_template('register.html')
            team = Team.query.filter_by(join_code=join_code).first()
            if not team:
                flash('Código de equipo inválido.')
                return render_template('register.html')
            user.team = team
        else:
            # Admins pueden crear un equipo luego del registro
            user.team = None

        db.session.add(user)
        db.session.commit()

        flash('Registro exitoso, ahora puedes iniciar sesión.')
        return redirect(url_for('auth.login'))

    return render_template('register.html')


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user)
            session_log = SessionLog(user_id=user.id)
            db.session.add(session_log)
            db.session.commit()
            return redirect(url_for('main.dashboard'))

        flash('Credenciales inválidas.')

    return render_template('login.html')


@auth_bp.route('/logout')
@login_required
def logout():
    session_log = SessionLog.query.filter_by(user_id=current_user.id, logout_time=None).order_by(SessionLog.login_time.desc()).first()
    if session_log:
        session_log.logout_time = datetime.utcnow()
        db.session.commit()

    logout_user()
    flash('Sesión cerrada correctamente.')
    return redirect(url_for('auth.login'))


@main_bp.route('/')
@login_required
def dashboard():
    if current_user.role == 'admin':
        team = Team.query.filter_by(admin_id=current_user.id).first()
        if not team:
            return render_template('admin_dashboard.html', team=None)

        members = User.query.filter(User.team_id == team.id, User.id != current_user.id).all()
        sessions = SessionLog.query.join(User).filter(User.team_id == team.id).order_by(SessionLog.login_time.desc()).limit(20).all()
        leads = Lead.query.filter_by(team_id=team.id).order_by(Lead.created_at.desc()).limit(10).all()
        appointments = Appointment.query.filter_by(team_id=team.id).order_by(Appointment.scheduled_for.desc()).limit(10).all()
        messages = Message.query.filter_by(team_id=team.id).order_by(Message.created_at.desc()).limit(20).all()
        return render_template(
            'admin_dashboard.html',
            team=team,
            members=members,
            sessions=sessions,
            leads=leads,
            appointments=appointments,
            messages=messages,
        )

    # Agent view
    leads = Lead.query.filter_by(agent_id=current_user.id).order_by(Lead.created_at.desc()).all()
    appointments = Appointment.query.filter_by(agent_id=current_user.id).order_by(Appointment.scheduled_for.desc()).all()
    team = current_user.team
    messages = []
    if team:
        messages = Message.query.filter_by(team_id=team.id).order_by(Message.created_at.desc()).limit(20).all()
    return render_template('agent_dashboard.html', leads=leads, appointments=appointments, team=team, messages=messages)


@main_bp.route('/team/create', methods=['POST'])
@login_required
def create_team():
    if current_user.role != 'admin':
        flash('Solo los administradores pueden crear equipos.')
        return redirect(url_for('main.dashboard'))

    team_name = request.form.get('team_name')
    if not team_name:
        flash('El nombre del equipo es obligatorio.')
        return redirect(url_for('main.dashboard'))

    existing_team = Team.query.filter_by(admin_id=current_user.id).first()
    if existing_team:
        flash('Ya existe un equipo asociado a este administrador.')
        return redirect(url_for('main.dashboard'))

    join_code = secrets.token_hex(4)
    team = Team(name=team_name, join_code=join_code, admin_id=current_user.id)
    db.session.add(team)
    current_user.team = team
    db.session.commit()
    flash(f'Equipo "{team_name}" creado. Comparte el código {join_code} con tus agentes.')
    return redirect(url_for('main.dashboard'))


@main_bp.route('/leads/add', methods=['POST'])
@login_required
def add_lead():
    if current_user.role != 'agent':
        flash('Solo los agentes pueden registrar leads.')
        return redirect(url_for('main.dashboard'))

    name = request.form.get('name')
    contact_info = request.form.get('contact_info')
    status = request.form.get('status', 'nuevo')
    notes = request.form.get('notes')

    if not all([name, contact_info]):
        flash('Nombre y datos de contacto son obligatorios.')
        return redirect(url_for('main.dashboard'))

    lead = Lead(
        name=name,
        contact_info=contact_info,
        status=status,
        notes=notes,
        agent_id=current_user.id,
        team_id=current_user.team_id,
    )
    db.session.add(lead)
    db.session.commit()
    flash('Lead registrado correctamente.')
    return redirect(url_for('main.dashboard'))


@main_bp.route('/appointments/add', methods=['POST'])
@login_required
def add_appointment():
    if current_user.role != 'agent':
        flash('Solo los agentes pueden agendar citas.')
        return redirect(url_for('main.dashboard'))

    date_str = request.form.get('scheduled_for')
    notes = request.form.get('notes')
    lead_id = request.form.get('lead_id')

    if not date_str:
        flash('La fecha y hora de la cita son obligatorias.')
        return redirect(url_for('main.dashboard'))

    try:
        scheduled_for = datetime.fromisoformat(date_str)
    except ValueError:
        flash('Formato de fecha inválido. Usa el selector de fecha y hora.')
        return redirect(url_for('main.dashboard'))

    appointment = Appointment(
        scheduled_for=scheduled_for,
        notes=notes,
        agent_id=current_user.id,
        team_id=current_user.team_id,
        lead_id=lead_id or None,
    )
    db.session.add(appointment)
    db.session.commit()
    flash('Cita agendada correctamente.')
    return redirect(url_for('main.dashboard'))


@main_bp.route('/messages/send', methods=['POST'])
@login_required
def send_message():
    if not current_user.team_id:
        flash('Debes pertenecer a un equipo para enviar mensajes.')
        return redirect(url_for('main.dashboard'))

    content = request.form.get('content')
    if not content:
        flash('El mensaje no puede estar vacío.')
        return redirect(url_for('main.dashboard'))

    message = Message(
        content=content,
        team_id=current_user.team_id,
        sender_id=current_user.id,
    )
    db.session.add(message)
    db.session.commit()
    flash('Mensaje enviado.')
    return redirect(url_for('main.dashboard'))
