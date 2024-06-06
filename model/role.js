// models/Role.js
// module.exports = (sequelize, DataTypes) => {
//     const Role = sequelize.define('Role', {
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//     });
  
//     Role.associate = (models) => {
//       Role.belongsToMany(models.Auth, { through: 'UserRoles' });
//     };
  
//     return Role;
//   };
  
//   // models/Auth.js
//   module.exports = (sequelize, DataTypes) => {
//     const Auth = sequelize.define('Auth', {
//       fullname: DataTypes.STRING,
//       username: DataTypes.STRING,
//       password: DataTypes.STRING,
//     });
  
//     Auth.associate = (models) => {
//       Auth.belongsToMany(models.Role, { through: 'UserRoles' });
//     };
  
//     return Auth;
//  };
//   ol
 //????? Add junction table UserRoles?????
 