import { Injectable } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class SomeService {
  async getExternalData() {
    const response = await axios.get('https://api.externa.com/dados')
    return response.data
  }
}
