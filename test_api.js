// test_api.js
async function runTests() {
    const baseUrl = 'http://localhost:3000/api';

    try {
        console.log("1. Creating a new Role...");
        let res = await fetch(`${baseUrl}/roles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'AdminTest', description: 'System Administrator' })
        });
        const role = await res.json();
        console.log("Role created:", role);

        if (!role._id) {
            console.log("Failed to create role. Maybe it already exists? Getting existing role...");
            res = await fetch(`${baseUrl}/roles`);
            const roles = await res.json();
            Object.assign(role, roles[0]);
        }

        console.log("\n2. Creating a new User...");
        res = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admintest123',
                password: 'password123',
                email: 'admintest@example.com',
                fullName: 'Admin Test User',
                role: role._id
            })
        });
        const user = await res.json();
        console.log("User created:", user);

        console.log("\n3. Testing /enable endpoint...");
        res = await fetch(`${baseUrl}/enable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admintest@example.com', username: 'admintest123' })
        });
        const enabledUser = await res.json();
        console.log("Enable result:", enabledUser);

        console.log("\n4. Testing /disable endpoint...");
        res = await fetch(`${baseUrl}/disable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admintest@example.com', username: 'admintest123' })
        });
        const disabledUser = await res.json();
        console.log("Disable result:", disabledUser);

        console.log("\n5. Getting users by Role ID...");
        res = await fetch(`${baseUrl}/roles/${role._id}/users`);
        const usersByRole = await res.json();
        console.log(`Users with role ID ${role._id}:`, usersByRole);

        console.log("\n6. Soft deleting User...");
        res = await fetch(`${baseUrl}/users/${user._id}`, { method: 'DELETE' });
        console.log("Delete user result:", await res.json());

        console.log("\n7. Soft deleting Role...");
        res = await fetch(`${baseUrl}/roles/${role._id}`, { method: 'DELETE' });
        console.log("Delete role result:", await res.json());

    } catch (err) {
        console.error("Test failed:", err);
    }
}

runTests();
