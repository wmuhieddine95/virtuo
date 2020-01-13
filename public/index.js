'use strict';

//list of cars
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const cars = [{
  'id': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'name': 'fiat-500-x',
  'pricePerDay': 36,
  'pricePerKm': 0.10
}, {
  'id': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'name': 'mercedes-class-a',
  'pricePerDay': 44,
  'pricePerKm': 0.30
}, {
  'id': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'name': 'bmw-x1',
  'pricePerDay': 52,
  'pricePerKm': 0.45
}];

//list of current rentals
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful for step 4
const rentals = [{
  'id': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'driver': {
    'firstName': 'Roman',
    'lastName': 'Frayssinet'
  },
  'carId': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'pickupDate': '2020-01-02',
  'returnDate': '2020-01-02',
  'distance': 100,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'driver': {
    'firstName': 'Redouane',
    'lastName': 'Bougheraba'
  },
  'carId': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'pickupDate': '2020-01-05',
  'returnDate': '2020-01-09',
  'distance': 300,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'driver': {
    'firstName': 'Fadily',
    'lastName': 'Camara'
  },
  'carId': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'pickupDate': '2019-12-01',
  'returnDate': '2019-12-15',
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'rentalId': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}];

//Method of Rental Price of a car
function calcRental(ndays, pday, nkm, pkm) {
  return (ndays * pday) + (nkm * pkm);   // The function returns the product of p1 and p2
}

//Discount on LongTerm Rental
function discOffers (price, ndays){
  if(ndays>1&&ndays<=4)
   return price * 0.9; //10% Discounts
   else if(ndays>4&&ndays<=10)
   return price * 0.7;
   else if(ndays>10)
   return price * 0.5;
   else
   return price;
}

//Dividing the commision (30% of Rental Price)
function calcCommission(price,ndays)
{
  var commission = new Array(4);
  var takenCommission = price*0.3;
  var insurance=takenCommission*0.5;
  commission[0]=insurance;
  var treasury= ndays * 1;
  commission[1]=treasury;
  var profit=takenCommission-insurance-treasury;
  commission[2]=profit;
  return commission;
}

//Adjusting price in case of service registration
function deductibleReductionPrice(bool,price,ndays)
{
  if(bool)
    return (price + (4*ndays));
  else
    return price;
}

//Running calculations and modifying arrays
function calcProcedure() {
  var pday = 0;
  var pkm = 0;
  var ndays = 1;
  var finalPrice =0;
rentals.forEach(rental => cars.forEach(car =>
  {
        if (car.id.localeCompare(rental.carId))
        {
		//Get Parameters for Price
          pday = car.pricePerDay;
          pkm =  car.pricePerKm;
		//Rental Duration
          const from = new Date(rental.pickupDate)
          const to = new Date(rental.returnDate)
          const one_day=1000*60*60*24;
          const ndays_ms = (to.getTime()-from.getTime())+one_day;
          ndays= Math.round(ndays_ms/one_day);
		 //Calculate Default Price
          var price= calcRental(ndays,pday,rental.distance,pkm);
         //Apply Discount on Rental Duration
		  var afterDisc = discOffers(price,ndays)
         // Service Registration versus Price
		  if(rental.options.deductibleReduction)
          var afterService = deductibleReductionPrice(true,afterDisc,ndays);
          else
          var afterService = deductibleReductionPrice(false,afterDisc,ndays);
         // Setting Last Price to be paid by driver
		  finalPrice = afterService;
          rental.price= finalPrice;
		 // Take credit of commision from debit payment
		 rental.commission=calcCommission(finalPrice,ndays);
         // Testing Methods
		  console.log("ndays is: "+ndays);
          console.log("pday is: "+pday);
          console.log("pkm is: "+pkm);
          console.log("dist is: "+rental.distance);
          console.log(rental.carId+" rental price is: "+ price);
          console.log("After Discount: "+afterDisc);
          console.log("After Service: "+afterService);
        }
  }));
}

//Modifying Actors Array depending on Rental Details
function finalizePayment(){
  actors.forEach(actor => rentals.forEach(rental =>
    {
      if (rental.id.localeCompare(actor.rentalId))
      {
        //TotalPayment
        actor.payment[0].amount=rental.price;
        //Partner
        actor.payment[1].amount=rental.price*0.7;
        //insurance
        actor.payment[2].amount=rental.commission[0];
        //treasury
        actor.payment[3].amount=rental.commission[1];
        //Virtuo
        actor.payment[4].amount=rental.commission[2];
      }
}));
}
calcProcedure.call();
finalizePayment.call();


console.log(cars);
console.log(rentals);
console.log(actors);
