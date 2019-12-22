import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from './app.service';
import { Observable, fromEvent, of } from 'rxjs';
import { pluck, distinct, debounceTime, mergeMap, catchError, map } from 'rxjs/operators';

interface IVkUser {
  id: number;
  first_name: string;
  last_name: string;
  is_closed: boolean;
  can_access_closed: boolean;
  photo_big: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public users: IVkUser[] = [];

  @ViewChild('text_input', {read: ElementRef}) input: ElementRef;

  constructor(private appS: AppService) { }

  ngOnInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        pluck('target', 'value'),
        // защита от неизменяемого инпута
        distinct(),
        // защита от частоты запросов, чтобы вк не забанил
        debounceTime(2000),
        // создаем новый стрим из выполненого метода
        mergeMap((value: string) => this.appS.getUserById(value)),
        catchError(error => of(error)),
        // мутируем response в удобным нам формат
        map(res => res.response)
      ).subscribe(
          (users: IVkUser[]) => {
            this.users = users;
          },
          error => console.log(error),
          () => console.log('completed!')
      );
  }
}
