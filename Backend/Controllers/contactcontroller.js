const Contacts = require("../Models/contactmodel");

// Add Contact
const addcontact = async (req, res) => {
    try {
        const message = new Contacts(req.body);
        await message.save();

        res.status(201).json({ msg: "Message sent successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error in sending message" });
    }
};

// Get Contacts
const getcontact = async (req, res) => {
    try {
        const messages = await Contacts.find();

        res.status(200).json({msg: "Getting messages successful",data: messages});
    } catch (error) {
        res.status(500).json({ msg: "Error in getting messages",error });
    }
};

const deleteMessage = async (req, res) => {
  try {
    await Contacts.findByIdAndDelete(req.params.id)
    res.json({ msg: "Message deleted successfully" })
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" })
  }
}

module.exports = { addcontact, getcontact,deleteMessage };