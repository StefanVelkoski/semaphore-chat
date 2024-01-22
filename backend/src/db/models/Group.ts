import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    // there will be only one group for one chat
    // generate a group and populate the Database with one group in development; will do it manually in production
    // update the group members with a POST request every time there is a new member to the group
    // the group root changes every time a new members is added but don't need to store that
    Id: {
        type: Number,
        unique: true,
        required: true
    },
    treeDepth: {
        type: Number,
        required: true,
        unique: true,
    },
    members: {
        type: Array,
        required: true,
        unique: true,
    },
});

const Group = mongoose.model('group', groupSchema);

export default Group;
