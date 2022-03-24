import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Certificate } from './certificate.model';

export interface CertificatesState {
  certificates: Certificate[];
}

const initialState: CertificatesState = {
  certificates: [],
};

const certificatesUrl =
  'https://capstone-certificates.herokuapp.com/api/certificates';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private readonly store$ = new BehaviorSubject<CertificatesState>(
    initialState
  );

  readonly userCertificates$ = this.store$.pipe(
    map((state) => state.certificates)
  );

  constructor(private http: HttpClient) {}

  get currentCertificates(): Certificate[] {
    return this.store$.value.certificates;
  }

  setCurrentCertificates(certs: Certificate[]) {
    this.store$.next({
      ...this.store$.value,
      certificates: certs,
    });
  }

  clearCurrentCertificates() {
    this.store$.next({
      ...this.store$.value,
      certificates: [],
    });
  }

  fetchUserCertificates(userId: number) {
    const allCertsSubscription = this.http
      .get(certificatesUrl)
      .subscribe((response) => {
        if (Array.isArray(response)) {
          const userCerts = response.filter(
            (certificate) => certificate.userId === userId
          );
          this.setCurrentCertificates(userCerts);
          allCertsSubscription.unsubscribe();
        }
      });
  }

  addCertificate(newCertObj: {
    name: string | null;
    initialAmount: number;
    interestRate: number;
    startDate: Date;
    maturityDate: Date;
    userId: number;
  }): Observable<any> {
    return this.http.post(certificatesUrl, newCertObj);
  }

  removeCertificate(certificateId: number): Observable<any> {
    return this.http.delete(certificatesUrl + `/${certificateId}`);
  }
}
