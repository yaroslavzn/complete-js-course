/*****************************
 * CODING CHALLENGE 4
 */

/*
Let's remember the first coding challenge where Mark and John compared their BMIs. Let's now implement the same functionality with objects and methods.
1. For each of them, create an object with properties for their full name, mass, and height
2. Then, add a method to each object to calculate the BMI. Save the BMI to the object and also return it from the method.
3. In the end, log to the console who has the highest BMI, together with the full name and the respective BMI. Don't forget they might have the same BMI.

Remember: BMI = mass / height^2 = mass / (height * height). (mass in kg and height in meter).

GOOD LUCK 😀
*/

var john = {
  fullName: 'John',
  mass: 95,
  height: 1.78,
  calculateBmi: function() {
      this.bmi = this.mass / (this.height * this.height);
      return this.bmi;
  },
};

var mark = {
    fullName: 'Mark',
    mass: 95,
    height: 1.78,
    calculateBmi: function() {
        this.bmi = this.mass / (this.height * this.height);
        return this.bmi;
    },
};

if (john.calculateBmi() > mark.calculateBmi()) {
    console.log(john.fullName + ' respective BMI is ' + john.bmi);
} else if (mark.calculateBmi() > john.calculateBmi()) {
    console.log(mark.fullName + ' respective BMI is ' + mark.bmi);
} else {
    console.log(john.fullName + ' and ' + mark.fullName + ' BMI is equal.');
}