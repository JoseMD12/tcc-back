import { Controller, Get } from '@nestjs/common';

@Controller('/rfid')
export class ReadTagInfoController {
  @Get()
  async execute() {
    console.log('Conectou!');
  }
}
