import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  enableFormLogin: boolean = false;
  faEmail = faEnvelope;
  faLock = faLock;
  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }



  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async submit(enableFormLogin) {
    if (!enableFormLogin) {
      this.register();
    } else {
      this.login();
    }
  }

  async presentToastSuccess(position) {
    const toast = await this.toastController.create({
      message: 'Cuenta creada con éxito, ya puedes iniciar sesión!',
      duration: 1800,
      position: position,
      color: "success",
    });

    await toast.present();
  }

  async presentToastFailed(position) {
    const toast = await this.toastController.create({
      message: 'Hubo un fallo al crear la cuenta, vuelva a intentar',
      duration: 1800,
      position: position,
      color: "danger",
    });

    await toast.present();
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();
    if (user) {
      this.presentToastSuccess('middle');
    } else {
      this.presentToastFailed('middle');
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      const toast = await this.toastController.create({
        message: 'Hubo un fallo al iniciar sesión, vuelva a intentar',
        duration: 1800,
        position: "middle",
        color: "danger",
      });
      toast.present();
    }
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
