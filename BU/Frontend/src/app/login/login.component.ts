import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private http: HttpClient, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}
  /** on submitting the login form */
  onSubmitLogin() {
    if (this.loginForm.valid) {
      // this.router.navigate(['/dashboard']); // navigate to other page
      var headers = new HttpHeaders();
      headers = headers.append('Accept', 'application/json');
      headers = headers.append('Content-Type', 'application/json');

      let options = {
        headers: headers,
      };
      this.http
        .post<any>(
          'http://localhost:3000/api/login',
          JSON.stringify(this.loginForm.value),
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
    } else {
      console.log('User not found');
    }
  }
}
