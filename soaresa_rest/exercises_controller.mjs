import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';
import cors from "cors";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

// CORS MUST be before routes
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://exercise-tracker-dusky-gamma.vercel.app/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.options("*", cors()); // handle preflight
app.use(express.json());

// Accepts either MM-DD-YY or YYYY-MM-DD (native date input)
// Returns normalized MM-DD-YY, or null if invalid.
function normalizeDateToMMDDYY(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const s = dateStr.trim();

  // MM-DD-YY
  const mmddyy = /^(\d{2})-(\d{2})-(\d{2})$/;
  const m1 = s.match(mmddyy);
  if (m1) {
    const mm = Number(m1[1]);
    const dd = Number(m1[2]);
    // basic sanity (not perfect calendar validation, but better than regex only)
    if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) return s;
    return null;
  }

  // YYYY-MM-DD (from <input type="date">)
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/;
  const m2 = s.match(iso);
  if (m2) {
    const yy = m2[1].slice(2); // last 2 digits
    const mm = m2[2];
    const dd = m2[3];

    const mmNum = Number(mm);
    const ddNum = Number(dd);
    if (mmNum < 1 || mmNum > 12 || ddNum < 1 || ddNum > 31) return null;

    return `${mm}-${dd}-${yy}`;
  }

  return null;
}


function validateExercise(req, res, next) {
    let { name, reps, weight, unit, date } = req.body;

    if (!name) {
        return res.status(400).json({ field: "name", message: "Name is required" });
    }

    name = name.trim();
    unit = unit.trim().toLowerCase();
    date = date.trim();

    const normalizedDate = normalizeDateToMMDDYY(date);

    if (!normalizedDate) {
    return res.status(400).json({
        field: "date",
        message: "Date must be MM-DD-YY or YYYY-MM-DD",
    });
    }

req.body.date = normalizedDate;


    if (!Number.isInteger(reps) || reps <= 0) {
        return res.status(400).json({ field: "reps", message: "Reps must be a positive integer" });
    }

    if (typeof weight !== "number" || weight < 0) {
        return res.status(400).json({ field: "weight", message: "Weight must be a positive number" });
    }

    const allowedUnits = ["lbs", "kgs"];
    if (!allowedUnits.includes(unit)) {
        return res.status(400).json({ field: "unit", message: "Unit must be 'lbs' or 'kgs'" });
    }

    req.body.name = name;
    req.body.unit = unit;
    req.body.date = date;

    next();
}




//Create a new exercise with the name, reps, weight, unit, and date
app.post('/exercises', validateExercise, (req, res) => {
    const { name, reps, weight, unit, date } = req.body;

    exercises.createExercise(name, reps, weight, unit, date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error("POST /exercises error:", error);
            res.status(500).json({ Error: 'Internal server error' });
        });
});



//Retrieve the exercise corresponding to the ID provided in the URL. 
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => {
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            res.status(400).json({ Error: 'Request failed' });
        });
});

//Retrieve exercises.
//Filter the returned exercises based on the query parameters
//Otherwise, all exercises are returned
app.get('/exercises', (req, res) => {
    let filter = {};
    
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });
});

//Update the exercise whose id is provided in the path parameter
app.put('/exercises/:_id', validateExercise, (req, res) => {
    const { name, reps, weight, unit, date } = req.body;

    exercises.replaceExercise(req.params._id, name, reps, weight, unit, date)
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({ _id: req.params._id, name, reps, weight, unit, date });
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error("PUT /exercises error:", error);
            res.status(500).json({ Error: 'Internal server error' });
        });
});


//Delete the movie whos id is provided in the query parameters
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
})