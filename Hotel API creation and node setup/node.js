const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb+srv://ChukwubuikemUbaka:<ChukwubuikemUbaka>@cluster0.iyh4rpi.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const roomTypeSchema = new Schema({
  name: { type: String, required: true },
});

const RoomType = mongoose.model('RoomType', roomTypeSchema);

const roomSchema = new Schema({
  name: { type: String, required: true },
  roomType: { type: Schema.Types.ObjectId, ref: 'RoomType', required: true },
  price: { type: Number, required: true },
});

const Room = mongoose.model('Room', roomSchema);


//End points 

const express = require('express');
const app = express();
app.use(express.json());

// POST endpoint to create a room type
app.post('/api/v1/room-types', async (req, res) => {
  try {
    const roomType = new RoomType(req.body);
    await roomType.save();
    res.status(201).json(roomType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// GET endpoint to fetch all room types
app.get('/api/v1/room-types', async (req, res) => {
  try {
    const roomTypes = await RoomType.find();
    res.json(roomTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// POST endpoint to create a room
app.post('/api/v1/rooms', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// GET endpoint to fetch all rooms with optional filtering
app.get('/api/v1/rooms', async (req, res) => {
  try {
    const searchRoomNameMatch = req.query.search || '';
    const searchRoomTypeNameMatch = req.query.roomType || '';
    const searchRoomMinimumPriceMatch = req.query.minPrice || 0;
    const searchRoomMaximumPriceMatch = req.query.maxPrice || Infinity;
    
    const rooms = await Room.find({
      name: { $regex: searchRoomNameMatch, $options: 'i' },
      roomType: searchRoomTypeNameMatch,
      price: { $gte: searchRoomMinimumPriceMatch, $lte: searchRoomMaximumPriceMatch },
    });
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// PATCH endpoint to update a room
app.patch('/api/v1/rooms/:roomId', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.roomId, req.body, { new: true });
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// DELETE endpoint to delete a room
app.delete('/api/v1/rooms/:roomId', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.roomId);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
    }
    });
    
    // GET endpoint to fetch a single room by ID
    app.get('/api/v1/rooms/:roomId', async (req, res) => {
    try {
    const room = await Room.findById(req.params.roomId);
    res.json(room);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
    }
    });
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
