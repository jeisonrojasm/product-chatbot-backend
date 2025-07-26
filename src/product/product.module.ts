import { Module } from '@nestjs/common';
import { ProductService } from './product.service';

@Module({
  providers: [ProductService],
  exports: [ProductService], // Exporting ProductService to be used in other modules
})
export class ProductModule { }
