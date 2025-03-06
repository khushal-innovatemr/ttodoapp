const mongoose =  require('mongoose');

const TaskSchema = new mongoose.Schema({
    id: { type: Number,unique:true},
    name:{type:String, default:"Task 1"},
    description:{type:String, default:"Sample Description"},
    createdAt:{type:String, default:new Date().toDateString()},
    deadline:{type:String, default:new Date().toDateString()},
    completed:{type:Boolean, default:"false"},
    userId: { type: String, required: true },
} )

TaskSchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next();
    }

    const lastTask = await Todo.findOne().sort({ id: -1 });

    if (lastTask) {
        this.id = lastTask.id + 1;
    } else {
        this.id = 1;
    }

    next();
});



const Todo = mongoose.model("Task",TaskSchema);
module.exports = Todo;