const API_URL = '/api';

// --- Khởi tạo ---
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    fetchRoles();

    // Lắng nghe submit form
    document.getElementById('user-form').addEventListener('submit', handleAddUser);
    document.getElementById('role-form').addEventListener('submit', handleAddRole);
});

// --- Fetch Data ---
async function fetchUsers() {
    try {
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();
        renderUsers(users);
    } catch (err) {
        console.error('Error fetching users:', err);
    }
}

async function fetchRoles() {
    try {
        const res = await fetch(`${API_URL}/roles`);
        const roles = await res.json();
        renderRoleOptions(roles);
    } catch (err) {
        console.error('Error fetching roles:', err);
    }
}

// --- Rendering ---
function renderUsers(users) {
    const list = document.getElementById('user-list');
    list.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-info">
                    <img src="${user.avatarUrl}" class="avatar" alt="avatar">
                    <div>
                        <div style="font-weight: 700;">${user.username}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${user.fullName || 'Chưa cập nhật tên'}</div>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="badge badge-role">${user.role?.name || 'N/A'}</span></td>
            <td>
                <label class="switch">
                    <input type="checkbox" ${user.status ? 'checked' : ''} onchange="toggleUserStatus('${user.email}', '${user.username}', this.checked)">
                    <span class="slider"></span>
                </label>
            </td>
            <td>
                <button class="btn-delete" onclick="deleteUser('${user._id}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function renderRoleOptions(roles) {
    const select = document.getElementById('role-select');
    select.innerHTML = '<option value="">Chọn một role...</option>' +
        roles.map(r => `<option value="${r._id}">${r.name}</option>`).join('');
}

// --- Action Handlers ---
async function handleAddUser(e) {
    e.preventDefault();
    const data = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role-select').value
    };

    try {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            e.target.reset();
            fetchUsers();
        } else {
            const err = await res.json();
            alert('Lỗi: ' + err.error);
        }
    } catch (err) {
        console.error(err);
    }
}

async function handleAddRole(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('role-name').value,
        description: document.getElementById('role-desc').value
    };

    try {
        const res = await fetch(`${API_URL}/roles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            e.target.reset();
            fetchRoles();
        }
    } catch (err) {
        console.error(err);
    }
}

async function toggleUserStatus(email, username, isEnable) {
    const endpoint = isEnable ? '/enable' : '/disable';
    try {
        await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username })
        });
    } catch (err) {
        console.error(err);
    }
}

async function deleteUser(id) {
    if (!confirm('Bạn có chắc muốn xoá người dùng này?')) return;
    try {
        await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        fetchUsers();
    } catch (err) {
        console.error(err);
    }
}
