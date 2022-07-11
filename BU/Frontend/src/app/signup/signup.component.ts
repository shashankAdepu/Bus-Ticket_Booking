import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  constructor(private http: HttpClient, private router: Router) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      dob: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8}'),
      ]),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('signupForm.value', this.signupForm.value);
      var headers = new HttpHeaders();
      headers = headers.append('Accept', 'application/json');
      headers = headers.append('Content-Type', 'application/json');

      let options = {
        headers: headers,
      };
      this.http
        .post<any>(
          'http://localhost:3000/api/users',
          JSON.stringify(this.signupForm.value),
          options
        )
        .subscribe((data) => {
          console.log('status', data);
          if (data.statusCode == 200) {
            localStorage.setItem('token', data.token);
            this.router.navigate(['/dashboard']);
          } else if (data.statusCode == 400) {
            alert('Invalid Credentials!');
          }
        });
    }
  }
}
