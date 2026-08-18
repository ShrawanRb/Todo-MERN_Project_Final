import Todo from "../model/todo.model.js";

export const createTodo = async(req, res) => {
    const todo=new Todo({
        text:req.body.text,
        completed:req.body.completed
    });

    try {
        const newTodo= await todo.save()
        res.status(201).json({message:"Todo Created Sucessfully",newTodo});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:" Error Occuring in To do Creation"});
    }
};

export const getTodos=async(req,res)=>{
    try {
        const todos=await Todo.find()
         res.status(201).json({message:"Todo Fetched Sucessfully",todos});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:" Error Occuring in To do fetching"});
    }
}; 
 
export const updateTodo= async (req,res) => {
    try {
        const todo=await Todo.findByIdAndUpdate(req.params.id,req.body,{
            new:true,

        })
         res.status(201).json({message:"Todo Updated Sucessfully",todo});
    } catch (error) {
        console.log("error");
        res.status(400).json({message:" Error Occuring in To do updating"});
    }
    
}

export const deleteTodo = async (req,res) => {
    try {
        const todo= await Todo.findByIdAndDelete(req.params.id);
      if (!todo){
          res.status(404).json({message:" Todo not found"});
      }
      
        res.status(201).json({message:"Todo Deleted Sucessfully"});

    } catch (error) {
        console.log(error);
          res.status(400).json({message:" Error Occuring in To do Deletion "});
    }
}