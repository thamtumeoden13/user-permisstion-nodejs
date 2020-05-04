const { ROLE } = require('../data')

function canViewProject(user, project) {
    return (
        user.role === ROLE.ADMIN ||
        user.id === project.userId
    )
}

function canDeleteProject(user, project) {
    return user.id === project.userId
}

function scopedProjects(user, projects) {
    if (user.role === ROLE.ADMIN) return projects

    return projects.filter(project => user.id === project.userId)
}

module.exports = {
    canViewProject,
    canDeleteProject,
    scopedProjects
}