import { Injectable } from '@nestjs/common';
import { Grade } from '@prisma/client';

@Injectable()
export class PricingService {
  calculatePrice(mrp: number, grade: Grade, ageDays: number = 0): number {
    const gradeDiscount = {
      A: 0.3,
      B: 0.5,
      C: 0.7,
    }[grade];

    let ageMultiplier = 1;
    if (ageDays > 30) ageMultiplier = 0.85;
    if (ageDays > 60) ageMultiplier = 0.7;

    return Math.round(mrp * (1 - gradeDiscount) * ageMultiplier);
  }
}
