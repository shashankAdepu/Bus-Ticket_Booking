const Users = require('../../models/users');

const Buses = require('../../models/buses');

const config = require('../../config.json');
const jwt = require('jsonwebtoken');

module.exports = function (router) {

    // GET: to get users
    router.get('/users', function (req, res) {
        // res.send("hello");
        Users.find({}, (err, users) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if standup were found in database
                if (!users) {
                    res.json({ success: false, message: 'No users found.' }); // Return error of no standup found
                } else {
                   res.json({ success: true, users: users }); // Return success and standup array
                }
            }
        })
    })

    //POST: to signup the new user
    router.post('/users', function (req, res){
        let note = new Users(req.body)
        note.save(function (err, user) {
            if (err) {
                return res.status(400).json(err)
            }
            const token = jwt.sign({ id: user.id, name: user.name }, config.secret, { expiresIn: '7d' });
            res.json({ statusCode: 200, success: true, user: omitPassword(user)._doc, token: token });
        })
    })

    //PUT
    router.put('/updateUsers', (req, res) => {
        // Check if id was provided
        if (!req.body._id) {
            res.json({ success: false, message: 'No users id provided' }); // Return error message
        } else {
            // Check if id exists in database
            Users.findOne({ _id: req.body._id}, (err, users) => {
                // Check if id is a valid ID
                if (err) {
                    res.json({ success: false, message: 'Not a valid users id' }); // Return error message
                } else {
                    users.name = req.body.name;
                    users.email = req.body.email;
                    users.mobile = req.body.mobile;
                    users.password = req.body.password;
                    users.dob = req.body.dob;
                    users.gender = req.body.gender;
                    users.save((err) => {
                        if(err) {
                            res.json({ success: false, message: err }); // Return error message
                        } else {
                            res.json({ success: true, message: 'users Updated' }); // Return success message
                        }
                    });
                }
            });
        }
    });

    // DELETE
    router.delete('/deleteUsers/:id', (req, res) => {
        // Check if ID was provided in parameters
        if (!req.params.id) {
            res.json({ success: false, message: 'No id provided' }); // Return error message
        } else {
            // Check if id is found in database
            Users.findOne({ _id: req.params.id }, (err, users) => {
                // Check if error was found
                if (err) {
                    res.json({ success: false, message: 'Invalid id' }); // Return error message
                } else {
                    // Remove the users from database
                    users.remove((err) => {
                        if (err) {
                            res.json({ success: false, message: err }); // Return error message
                        } else {
                            res.json({ success: true, message: 'Users deleted!' }); // Return success message
                        }
                    });
                }
            });
        }
    });

    //Buses_List

    // GET: To get all busses
    router.get('/buses', function (req, res) {
        Buses.find({}, (err, buses) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if standup were found in database
                if (!buses) {
                    res.json({ success: false, message: 'No buses found.' }); // Return error of no standup found
                } else {
                   res.json({ success: true, buses: buses }); // Return success and standup array
                }
            }
        })
    })


    //POST: To add new bus
    router.post('/buses', function (req, res){
        let note = new Buses(req.body)
        note.save(function (err, note) {
            if (err) {
                return res.status(400).json(err)
            }
            res.status(200).json(note)
        })
    })

    // update the bus 
    router.put('/buses', (req, res) => {
        // Check if id was provided
        if (!req.body._id) {
            res.json({ success: false, message: 'No bus id provided' }); // Return error message
        } else {
            // Check if id exists in database
            Buses.findOne({ _id: req.body._id}, (err, bus) => {
                // Check if id is a valid ID
                if (err) {
                    res.json({ success: false, message: 'Not a valid bus id' }); // Return error message
                } else {
                    bus.bus_name = req.body.bus_name;
                    bus.bus_type = req.body.bus_type;
                    bus.from = req.body.from;
                    bus.to = req.body.to;
                    bus.date = req.body.date;
                    bus.arrival_time = req.body.arrival_time;
                    bus.departure_time = req.body.departure_time;
                    bus.total_seats = req.body.total_seats;
                    bus.available_seats = req.body.available_seats;
                    bus.booked_seats = req.body.booked_seats;
                    bus.fare = req.body.fare;
                    bus.leftSideSeats = req.body.leftSideSeats;
                    bus.rightSideSeats = req.body.rightSideSeats;
                    bus.save((err) => {
                        if(err) {
                            res.json({ success: false, message: err }); // Return error message
                        } else {
                            res.json({ success: true, message: 'bus Updated', data: bus }); // Return success message
                        }
                    });
                }
            });
        }
    });
    
    
    // DELETE
    router.delete('/deleteBuses/:id', (req, res) => {
        // Check if ID was provided in parameters
        if (!req.params.id) {
            res.json({ success: false, message: 'No id provided' }); // Return error message
        } else {
            // Check if id is found in database
            Buses.findOne({ _id: req.params.id }, (err, buses) => {
                // Check if error was found
                if (err) {
                    res.json({ success: false, message: 'Invalid id' }); // Return error message
                } else {
                    // Remove the users from database
                    buses.remove((err) => {
                        if (err) {
                            res.json({ success: false, message: err }); // Return error message
                        } else {
                            res.json({ success: true, message: 'Buses deleted!' }); // Return success message
                        }
                    });
                }
            });
           /*  Buses.remove(
                { _id: req.params.id }
             ) */
        }
    });


    //POST: get busses using filters ( to, from and datev)
    router.post('/busesWithFilters', function(req, res){     

        Buses.find({ from : req.body.from, to : req.body.to, date : req.body.date}, (err, buses) => {
            // Check if error was found or not
            if (err) {
                res.json({ statusCode: 500, success: false, message: err }); // Return error message
            } else {
                // Check if standup were found in database
                if (!buses) {
                    res.json({statusCode: 400, success: false, message: 'No buses found.' }); // Return error of no standup found
                } else {
                   res.json({ statusCode: 200, success: true, buses: buses }); // Return success and standup array
                }
            }
        })
    })
    
    
    //JWT token
    router.post('/login', function (req, res){
        /* res.status(200).json(req.body) */
        // let count = Users.find( { email : req.body.email , password : req.body.password } ).count()
        /* const user = Users.find(u => u.email === req.body.email && u.password === req.body.password); */
        const user = Users.findOne({ email : req.body.email, password : req.body.password}, (err, user) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if standup were found in database
                if (!user) {
                    res.json({ statusCode: 400, success: false, message: 'No users found.' }); // Return error of no standup found
                } else {
                    const token = jwt.sign({ id: user.id, name: user.name }, config.secret, { expiresIn: '7d' });
                    res.json({ statusCode: 200, success: true, user: omitPassword(user)._doc, token: token }); // Return success and standup array
                }
            }
        })

        if (!user) throw 'Username or password is incorrect';
    
    })

    function omitPassword(user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

}