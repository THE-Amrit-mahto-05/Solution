const User = require('../models/User');
const { USER_STATUS } = require('../config/constants');

class UserService {
  async getAllUsers() {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    return users;
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'role', 'status', 'created_at', 'updated_at']
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUserRole(id, newRole, currentUserId) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (id === currentUserId) {
      throw new Error('Cannot change your own role');
    }

    user.role = newRole;
    await user.save();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };
  }

  async updateUserStatus(id, newStatus, currentUserId) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (id === currentUserId && newStatus === USER_STATUS.INACTIVE) {
      throw new Error('Cannot deactivate your own account');
    }

    user.status = newStatus;
    await user.save();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };
  }

  async getUserStats() {
    const stats = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('role')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    return stats.reduce((acc, stat) => {
      acc[stat.role] = parseInt(stat.count);
      return acc;
    }, {});
  }
}

module.exports = new UserService();