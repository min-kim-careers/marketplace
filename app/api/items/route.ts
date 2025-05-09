import { ENDPOINTS } from '@/lib/constants/endpoints'
import { NextRequest } from 'next/server'
import { forwardGET } from '../common'

export const GET = async (req: NextRequest) => forwardGET(req, ENDPOINTS.ITEMS)
