const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new mongoose.Schema(
    {
        username : {
            type : mongoose.Schema.Types.ObjectId, //not a specific reference, but instead "this is an objectID from an schema"
            required : true,
            ref : 'User' //which schema
        },
        title : {
            type : String,
            required : true
        },
        text : {
            type : String,
            required : true
        },
        completed : {
            type : Boolean,
            default : false
        }
    },
    {
        timestamps: true
    }
)

//This approach means this data is stored seperatly from the Note Collection
noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq : 500 
})

module.exports = mongoose.model('Note', noteSchema)
