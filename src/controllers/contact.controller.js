import Contact from '../models/contact.model'
import asyncHandler from '../services/asyncHandler'

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body
  const contact = await Contact.create({ name, email, subject, message })
  res
    .status(201)
    .json({ success: true, message: 'Message sent successfully', contact })
})

export const getAllContact = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query
  let query = {}

  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Admin access required' })
  }

  if (status && status !== 'all') query.status = status

  const messages = await Contact.find(query)
    .sort('-createdAt')
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit))

  const total = await Contact.countDocuments(query)
  const unread = await Contact.countDocuments({ status: 'new' })

  res
    .status(200)
    .json({ success: true, count: messages.length, total, unread, messages })
})

export const updateContact = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Admin access required' })
  }
  const { status } = req.body
  const message = await Contact.findById(id)
  if (!message) {
    return res
      .status(404)
      .json({ success: false, message: 'Message not found' })
  }
  message.status = status || message.status
  await message.save()
  res.status(200).json({ success: true, message })
})

export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Admin access required' })
  }
  const message = await Contact.findByIdAndDelete(id)
  if (!message) {
    return res
      .status(404)
      .json({ success: false, message: 'Message not found' })
  }
  res.status(200).json({ success: true, message: 'Deleted' })
})
