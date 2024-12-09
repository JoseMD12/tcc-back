import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('/rfid')
export class ReadTagInfoController {
  // constructor(private readonly )

  @Post()
  async execute(@Body() data: { rfidData: string }) {
    console.log(data.rfidData);
  }
}
