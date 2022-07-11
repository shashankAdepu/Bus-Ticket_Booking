import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  busesData: any;

  showBusesList: boolean = false;

  busesFilterForm: FormGroup;

  paymentForm: FormGroup;

  displayMessage!: string;

  SeatsSelected = 0;

  selectedIndex = 0;

  selectedIndexDummy = 0;

  selectedBusDetails: any;

  fareWithOutTax = 0;

  fareWithTax = 0;

  serviceCharge = 0;

  selectedSeatNumbers: any = [];

  userName: any;

  leftSideSeats: any;

  rightSideSeats: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private us: UsersService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.busesFilterForm = new FormGroup({
      from: new FormControl('', [Validators.required]),
      to: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
    });

    this.paymentForm = this.formBuilder.group({
      typeOfCard: ['', [Validators.required]],
      nameOnCard: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern('^[A-Za-z][A-Za-z -]*$'),
        ],
      ],
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.min(1111111111111111),
          Validators.max(9999999999999999),
        ],
      ],
      expirationMonth: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(2)],
      ],
      expirationYear: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.min(2021),
          Validators.max(2051),
        ],
      ],
      cardCVVNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(3),
          Validators.min(111),
          Validators.max(999),
        ],
      ],
    });

    this.demoForm = this._formBuilder.group({
      demoArray: this._formBuilder.array([]),
    });
  }

  minPlanDate = new Date();
  minYear = new Date().getFullYear();
  minCardDate = 0;
  maxCardDate = 12;
  originalFromCities = [
    'Bangalore',
    'Chennai',
    'Delhi',
    'Hyderabad',
    'Warangal',
  ];
  originalToCities = ['Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 'Warangal'];
  fromCities = ['Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 'Warangal'];
  toCities = ['Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 'Warangal'];
  TxID: any;
  ngOnInit(): void {
    this.userName = this.us.getName();
    if (!this.userName) {
      this.router.navigate(['/login']);
    }
    this.onValueChanges();
  }

  onValueChanges(): void {
    this.paymentForm.valueChanges.subscribe((val) => {
      if (val.expirationYear != '') {
        if (val.expirationYear == new Date().getFullYear()) {
          this.minCardDate = parseInt('0' + (new Date().getMonth() + 1));
          this.maxCardDate = 12;
        } else if (val.expirationYear < new Date().getFullYear()) {
          this.minCardDate = 1;
          this.maxCardDate = 0;
        } else if (val.expirationYear > new Date().getFullYear()) {
          this.minCardDate = 0;
          this.maxCardDate = 12;
        }
      }
    });
  }

  public demoForm: FormGroup;
  public arrayItems: any = [];

  get demoArray() {
    return this.demoForm.get('demoArray') as FormArray;
  }

  StoreDefaultCities(which: any) {
    if (which === 'from') {
      this.fromCities = [
        'Bangalore',
        'Chennai',
        'Delhi',
        'Hyderabad',
        'Warangal',
      ];
    } else if (which === 'to') {
      this.toCities = [
        'Bangalore',
        'Chennai',
        'Delhi',
        'Hyderabad',
        'Warangal',
      ];
    }
  }

  fromCitySelected(event: any) {
    this.StoreDefaultCities('to');
    const idx = this.toCities.indexOf(event.value);
    console.log('idx ==> ', idx);
    if (idx > -1) {
      this.toCities.splice(idx, 1);
    }
  }

  toCitySelected(event: any) {
    this.StoreDefaultCities('from');
    const idx = this.fromCities.indexOf(event.value);
    if (idx > -1) {
      this.fromCities.splice(idx, 1);
    }
  }

  editFilters() {
    this.showBusesList = false;
  }

  ClearFilters() {
    this.StoreDefaultCities('from');
    this.StoreDefaultCities('to');
    this.showBusesList = false;
    this.busesFilterForm.reset();
  }

  AddNewBus() {
    var headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.us.getToken());

    let options = {
      headers: headers,
    };
    let leftSideSeats = [
      { id: 1, selected: false, booked: false },
      { id: 2, selected: false, booked: false },
      { id: 3, selected: false, booked: false },
      { id: 4, selected: false, booked: false },
      { id: 5, selected: false, booked: false },
      { id: 6, selected: false, booked: false },
      { id: 7, selected: false, booked: false },
      { id: 8, selected: false, booked: false },
      { id: 9, selected: false, booked: false },
      { id: 10, selected: false, booked: false },
      { id: 11, selected: false, booked: false },
      { id: 12, selected: false, booked: false },
      { id: 13, selected: false, booked: false },
      { id: 14, selected: false, booked: false },
      { id: 15, selected: false, booked: false },
      { id: 16, selected: false, booked: false },
    ];
    let rightSideSeats = [
      { id: 17, selected: false, booked: false },
      { id: 18, selected: false, booked: false },
      { id: 19, selected: false, booked: false },
      { id: 20, selected: false, booked: false },
      { id: 21, selected: false, booked: false },
      { id: 22, selected: false, booked: false },
      { id: 23, selected: false, booked: false },
      { id: 24, selected: false, booked: false },
      { id: 25, selected: false, booked: false },
      { id: 26, selected: false, booked: false },
      { id: 27, selected: false, booked: false },
      { id: 28, selected: false, booked: false },
      { id: 29, selected: false, booked: false },
      { id: 30, selected: false, booked: false },
      { id: 31, selected: false, booked: false },
      { id: 32, selected: false, booked: false },
    ];
    let busDetails = {
      bus_name: 'Vajra',
      bus_type: 'Semi-Sleeper',
      from: 'Bangalore',
      to: 'Chennai',
      date: '8/10/2021',
      arrival_time: '9:00:00 AM',
      departure_time: '3:00:00 PM',
      total_seats: 32,
      available_seats: 32,
      booked_seats: 0,
      fare: 500,
      leftSideSeats: JSON.stringify(leftSideSeats),
      rightSideSeats: JSON.stringify(rightSideSeats),
    };
    this.http
      .post<any>(
        'http://localhost:3000/api/buses',
        JSON.stringify(busDetails),
        options
      )
      .subscribe((response) => {
        console.log(response);
        /* this.busesData=response.buses; */
        /* this.leftSideSeats = JSON.parse(this.busesData[0].leftSideSeats)
        this.rightSideSeats = JSON.parse(this.busesData[0].rightSideSeats) */
        /* this.showBusesList = true; */
      });
  }

  UpdateBus() {
    var headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.us.getToken());

    let options = {
      headers: headers,
    };
    for (let i = 0; i < this.leftSideSeats.length; i++) {
      if (this.leftSideSeats[i].selected === true) {
        this.leftSideSeats[i].selected = false;
        this.leftSideSeats[i].booked = true;
      }
    }
    for (let i = 0; i < this.rightSideSeats.length; i++) {
      if (this.rightSideSeats[i].selected === true) {
        this.rightSideSeats[i].selected = false;
        this.rightSideSeats[i].booked = true;
      }
    }
    let busDetails = {
      _id: this.selectedBusDetails._id,
      bus_name: this.selectedBusDetails.bus_name,
      bus_type: this.selectedBusDetails.bus_type,
      from: this.selectedBusDetails.from,
      to: this.selectedBusDetails.to,
      date: this.selectedBusDetails.date,
      arrival_time: this.selectedBusDetails.arrival_time,
      departure_time: this.selectedBusDetails.departure_time,
      total_seats: this.selectedBusDetails.total_seats,
      available_seats:
        this.selectedBusDetails.available_seats - this.SeatsSelected,
      booked_seats: this.selectedBusDetails.booked_seats + this.SeatsSelected,
      fare: this.selectedBusDetails.fare,
      leftSideSeats: JSON.stringify(this.leftSideSeats),
      rightSideSeats: JSON.stringify(this.rightSideSeats),
    };
    this.http
      .put<any>(
        'http://localhost:3000/api/buses',
        JSON.stringify(busDetails),
        options
      )
      .subscribe((response) => {
        console.log(response);
        this.selectedBusDetails = response.data;
        /* this.busesData=response.buses; */
        /* this.leftSideSeats = JSON.parse(this.busesData[0].leftSideSeats)
        this.rightSideSeats = JSON.parse(this.busesData[0].rightSideSeats) */
        /* this.showBusesList = true; */
      });
  }

  getBuses() {
    var headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.us.getToken());

    let options = {
      headers: headers,
    };

    let busDate = this.busesFilterForm.value.date;
    if (typeof this.busesFilterForm.value.date === 'object') {
      busDate = this.busesFilterForm.value.date.toLocaleDateString();
    }
    this.busesFilterForm.value.date = busDate;

    this.http
      .post<any>(
        'http://localhost:3000/api/busesWithFilters',
        JSON.stringify(this.busesFilterForm.value),
        options
      )
      .subscribe((response) => {
        this.busesData = response.buses;
        this.showBusesList = true;
      });
  }

  searchBuses() {}

  onSubmit() {
    if (this.paymentForm.invalid) {
      this.displayMessage = 'Payment Failed';
      return;
    }
    this.displayMessage = 'Payment Successful!';
  }

  onBusSelected(busDetails: any) {
    this.selectedBusDetails = busDetails;
    this.leftSideSeats = this.selectedBusDetails.leftSideSeats;
    this.leftSideSeats = JSON.parse(this.leftSideSeats);
    this.rightSideSeats = this.selectedBusDetails.rightSideSeats;
    this.rightSideSeats = JSON.parse(this.rightSideSeats);
    this.selectedIndex = 1;
    this.selectedIndexDummy = 1;
  }

  selectOrUnselectSeats(side: string, id: number) {
    this.selectedIndexDummy = 1
    if (side === 'left') {
      let index = id - 1;
      if (!this.leftSideSeats[index].booked) {
        if (this.leftSideSeats[index].selected) {
          const idx = this.selectedSeatNumbers.indexOf(id);
          if (idx > -1) {
            this.selectedSeatNumbers.splice(idx, 1);
          }
          this.leftSideSeats[index].selected = false;
          this.arrayItems.pop();
          this.demoForm.value.demoArray.pop();
          this.demoForm = this._formBuilder.group({
            demoArray: this._formBuilder.array([]),
          });
          this.SeatsSelected--;
          for(let i = 0; i < this.SeatsSelected; i++) {
            this.demoArray.push(
              this._formBuilder.control('', [Validators.required, Validators.pattern('^[A-Za-z][A-Za-z -]*$')])
            );
          }
        } else {
          this.selectedSeatNumbers.push(id);
          this.leftSideSeats[index].selected = true;
          this.arrayItems.push('x');
          this.demoArray.push(
            this._formBuilder.control('', [Validators.required, Validators.pattern('^[A-Za-z][A-Za-z -]*$')])
          );
          this.SeatsSelected++;
        }
      }
    } else if (side === 'right') {
      let index = id - 17;
      if (!this.rightSideSeats[index].booked) {
        if (this.rightSideSeats[index].selected) {
          const idx = this.selectedSeatNumbers.indexOf(id);
          if (idx > -1) {
            this.selectedSeatNumbers.splice(idx, 1);
          }
          this.rightSideSeats[index].selected = false;
          this.arrayItems.pop();
          this.demoForm.value.demoArray.pop();
          this.demoForm = this._formBuilder.group({
            demoArray: this._formBuilder.array([]),
          });
          this.SeatsSelected--;
          for(let i = 0; i < this.SeatsSelected; i++) {
            this.demoArray.push(
              this._formBuilder.control('', [Validators.required, Validators.pattern('^[A-Za-z][A-Za-z -]*$')])
            );
          }
        } else {
          this.selectedSeatNumbers.push(id);
          this.rightSideSeats[index].selected = true;
          this.arrayItems.push('x');
          this.demoArray.push(
            this._formBuilder.control('', [Validators.required, Validators.pattern('^[A-Za-z][A-Za-z -]*$')])
          );
          this.SeatsSelected++;
        }
      }
    }
    if (this.SeatsSelected > 0) {
      this.serviceCharge = 60;
    } else {
      this.serviceCharge = 0;
    }
    this.fareWithOutTax = this.selectedBusDetails.fare * this.SeatsSelected;
    this.fareWithTax = this.fareWithOutTax + this.serviceCharge;
  }

  continueToPayment() {
    this.TxID = Math.floor(Math.random() * 1000000);
    this.selectedIndex = 2;
    this.selectedIndexDummy = 2
  }

  selectedSeatNumbersForPrintingOnTicket = [];
  fareWithTaxForPrintingOnTicket: any;
  onClickPayNow() {
    this.UpdateBus();
    this.selectedIndex = 3;
    this.selectedIndexDummy = 3;
    this.selectedSeatNumbersForPrintingOnTicket = this.selectedSeatNumbers;
    this.selectedSeatNumbers = [];
    this.SeatsSelected = 0;
    this.fareWithOutTax = 0;
    this.serviceCharge = 0;
    this.fareWithTaxForPrintingOnTicket = this.fareWithTax;
    this.fareWithTax = 0;
    this.arrayItems = [];
    this.demoForm.reset();
    // this.paymentForm.reset();
    this.demoForm = this._formBuilder.group({
      demoArray: this._formBuilder.array([]),
    });
  }

  cancelPayment() {
    this.selectedIndex = 1;
  }

  onLogout() {
    localStorage.removeItem('token');
  }
}
