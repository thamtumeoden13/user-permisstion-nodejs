const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}

module.exports = {
    ROLE: ROLE,
    users: [
        { id: 1, name: 'Kelly', role: ROLE.ADMIN },
        { id: 2, name: 'Adam', role: ROLE.BASIC },
        { id: 3, name: 'Henry', role: ROLE.BASIC },
    ],
    projects: [
        { id: 1, name: "Kelly's project", userId: 1 },
        { id: 2, name: "Adam's project", userId: 2 },
        { id: 3, name: "Henry's project", userId: 3 },
    ]
}