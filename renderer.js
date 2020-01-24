require('dotenv').config();
const remote = require('electron').remote;
const main = remote.require('./main.js')
const ipc = require('electron').ipcRenderer;
var bcrypt = require('bcryptjs');
const cWindow = remote.getCurrentWindow();
const dap = "evol1234";
const dialog  = remote.require('electron').dialog;
const version = document.getElementById('version');
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
var vex = require('vex-js');
vex.registerPlugin(require('vex-dialog'));
// // vex.defaultOptions.className = 'vex-theme-os'
vex.defaultOptions.className = 'vex-theme-default';
//Connection to Mongodb
const mongoose = require("mongoose");
// const mongoURI = "mongodb://root:adminpwd@localhost:27017/tptwDB?authSource=admin";
const mongoURI = "mongodb://root:adminpwd@192.168.0.161:27017/tptwDB?authSource=admin";
// const mongoURI = "mongodb://localhost:27017/tptwDB";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};


// const version = document.getElementById('version');

ipc.send('app_version');
ipc.on('app_version', (event, arg) => {
  ipc.removeAllListeners('app_version');
  version.innerText = 'Version ' + arg.version;
});

mongoose.connect(mongoURI, options);

// CONNECTION EVENTS
// When successfully connected
// useUnifiedTopology: true
mongoose.connection.on('connected', function() {
  new Notification('Database connected');
});


// If the connection throws an error
mongoose.connection.on('error', function(err) {
  new Notification('Database default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
  new Notification('Database default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    new Notification('Database default connection disconnected through app termination');
    process.exit(0);
  });
});



//1.Create Schema
//USER LOGIN
const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    require: [true, "User ID cannot be blank"]
  },
  password: {
    type: String,
    require: [true, "User password cannot be blank"]
  }
});

const User = mongoose.model("User", userSchema);

// User.find({}, function(err, foundList) {
//   if(err) {
//     console.log(err);
//   } else {
//     if(foundList.length === 0) {
//       bcrypt.hash(dap, 8, function(err, hash) {
//       // bcrypt.hash(process.env.ADMIN_PASSWORD, 8, function(err, hash) {
//         const user = new User ({
//           _id: "admin",
//           password: hash
//         });
//         user.save(function(err) {
//           if(err) {
//             console.log(err);
//           } else {
//             console.log("User has been successfully created");
//           }
//         })
//       })
//     }
//   }
// })

$("#login-btn").on("click", function() {

  var pass = $("#uiPass").val();
  User.findOne({_id: $("#uiName").val()}, function(err, foundUser) {
    if (err) {
      new Notification(err);
    } else {
      if (foundUser) {
        // ipc.send("channel1", foundUser.role);
        // cWindow.close();
        bcrypt.compare(pass, foundUser.password, function(err, res) {
          if (res === true) {
            main.createSwitchProcessWindow();
            cWindow.close();
          } else {
            new Notification("Password is wrong!");
            cWindow.reload();
          }
        });
      } else {
        new Notification("Username is incorrect");
        cWindow.reload();
      }
    }
  })
  mongoose.connection.close()
});



//LOGIN PAGE LOGIN WITH ENTER KEY PRESSED
document.addEventListener("keypress", function(event) {
  if(event.key === "Enter") {
    var pass = $("#uiPass").val();

    //Connect to mongoose
    mongoose.connect(mongoURI, options);

    User.findOne({_id: $("#uiName").val()}, function(err, foundUser) {
      if (err) {
        new Notification(err);
      } else {
        if (foundUser) {
          bcrypt.compare(pass, foundUser.password, function(err, res) {
            if (res === true) {
              main.createSwitchProcessWindow();
              cWindow.close();
            } else {
              new Notification("Password is wrong!");
              cWindow.reload();
            }
          });
        } else {
          new Notification("Username is incorrect");
          cWindow.reload();
        }
      }
    })
    mongoose.connection.close();
  }
})
