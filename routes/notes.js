const express = require('express');
const router = express.Router();
var FetchUser = require('../middleware/FetchUser');
const Notes = require('../models/Notes')
const bcrypt = require('bcryptjs');
const {body,validationResult} = require('express-validator');
//Get all the Notes
router.get('/fetchallnotes',FetchUser,async(req,res)=>{
    const notes = await Notes.find({user:req.user.id});
    res.json(notes)
})


//Add a new Note using POST
router.post('/addnote',FetchUser,[
    body('title','Enter a Title').isLength({ min: 3 }),
    body('description','Enter a valid Description').isLength({ min: 5 }),
  ],
  async(req,res)=>{
    try {
        const {title,description,tag}=req.body;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const note = new Notes({
        title,description,tag,user:req.user.id
    })
    const saveNot = await note.save()
    res.json(saveNot);
    } catch (error) {
        console.error(error.message);
        res.status(404).send("Internal Server Error")
    }
    
})

//Route-3 Update an existing Note and ensure the User's validation
router.put('/updatenote/:id',FetchUser,async (req,res)=>{
    const {title,description,tag} = req.body;
    //Create a newNote Object
    const newNote = {};
    if(title){newNote.title=title;}
    if(description){newNote.description=description;}
    if(tag){newNote.tag=tag;}

    //Find the Note to be updated and update the note
    let note = await Notes.findById(req.params.id);
    if(!note){res.status(401).send("Not Found")}

    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
    res.json({note});
})

//Route-3 Delete an existing Note and ensure the User's validation
router.delete('/deletenote/:id',FetchUser,async (req,res)=>{
    const {title,description,tag} = req.body;
    try{

        //Find the Note to be updated and delete it
        let note = await Notes.findById(req.params.id);
        if(!note){res.status(401).send("Not Found")}
        //Allow the user to delete it
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed")
        }
        
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted",note:note});
    }
    catch(error){
        console.error(error.message);
        res.status(404).send("Internal Server Error")
    }
})
    

module.exports = router;