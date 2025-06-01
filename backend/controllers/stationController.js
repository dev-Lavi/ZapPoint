import Station from '../models/Station.js'

export const createStation = async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body
    const station = new Station({
      name,
      location,
      status,
      powerOutput,
      connectorType,
      createdBy: req.user.id
    })
    await station.save()
    res.status(201).json(station)
  } catch (err) {
    res.status(500).json({ message: 'Error creating station' })
  }
}

export const getStations = async (req, res) => {
  try {
    const stations = await Station.find({ createdBy: req.user.id })
    res.json(stations)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stations' })
  }
}

export const updateStation = async (req, res) => {
  try {
    const station = await Station.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    )
    if (!station) return res.status(404).json({ message: 'Station not found' })
    res.json(station)
  } catch (err) {
    res.status(500).json({ message: 'Error updating station' })
  }
}

export const deleteStation = async (req, res) => {
  try {
    const station = await Station.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    })
    if (!station) return res.status(404).json({ message: 'Station not found' })
    res.json({ message: 'Station deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting station' })
  }
}
