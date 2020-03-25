const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:'); // Example for sqlite

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const {Model, DataTypes, Op} = require('sequelize');

class Task extends Model {
  static async selectAll(taskInfo) {
    const {date, startDate, endDate, username} = taskInfo;
    let query = {};

    if (username) {
      if (date) {
        query = {where: {date, username}, order: ['username']}
      } else if (startDate && endDate) {
        query = {
          where: {
            date: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            },
            username
          }, order: ['username']
        }
      }
    } else {
      if (date) {
        query = {where: {date}, order: ['username']}
      } else if (startDate && endDate) {
        query = {
          where: {
            date: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            },
          }, order: ['username']
        }
      }
    }

    try {
      return await Task.findAll(query);
    } catch (error) {
      throw new Error(error);
    }
  }

  static async createOne(taskInfo) {
    try {
      const task = Task.build(taskInfo);
      return await task.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  static async deleteByNameAndDate(username, date) {
    try {
      return await Task.destroy({
        where: {username, date}
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

Task.init({
  id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  date: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  task: {
    type: DataTypes.STRING(3000)
  }
}, {sequelize, tableName: 'task', timestamps: false});

sequelize.sync();

(async () => {
  let task = await Task.create({id:Date.now(), username: 'woojin', date:'2020-03-25', task:'sequelize study'});
  console.log('task', task);
})();

(async () => {
  let tasks = await Task.findby({
    where:  {
      username: 'woojin'
    }
  });
  console.log('tasks', tasks);
})();

module.exports = () => {

};
