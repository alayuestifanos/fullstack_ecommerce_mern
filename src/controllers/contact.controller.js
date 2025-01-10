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
