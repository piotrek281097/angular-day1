import { Component } from '@angular/core';
import { interval, of, fromEvent, from, merge, forkJoin, throwError, Subject, BehaviorSubject, ReplaySubject, concat } from 'rxjs';
import { map, filter, take, takeUntil, takeWhile, catchError, scan, reduce, share, delay, concatAll, mergeAll, switchAll, switchMap, switchMapTo } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: FormGroup;

  checkUser(control: AbstractControl) {
    const url = 'https://api.debugger.pl/does-it-exist?username=' + control.value
    return of(1)
    .pipe(
      delay(2000),
      // switchMap(() => this.http.get(url))
      switchMapTo(this.http.get(url))
    )
  }
  createForm() {
    this.form = new FormGroup({
      username: new FormControl('joe', [
        Validators.email
      ], this.checkUser.bind(this))
    })
  }
  createObservable() {
    throw new Error("Method not implemented.");
  }
  createSubject() {
    //przy observable mozesz tylko nasluchiwac, one way data binding
    //subject sluzy do customowych zdarzen, na subject mozemy emitowac zdarzenia, za pomocą funkcji next(), tym się różni od observable

    /* const emitter$ = new Subject(); //znak dolara to konwencja nazewnicza
    emitter$.subscribe(console.log)

    emitter$.next(1);
    emitter$.next(2); */

    /* const bSubject = new BehaviorSubject({ id: 1}); //rozni sie od zwyklego subject tym ze ma init value początkowa wartość, bSubject odrazu emituje wartosc, ma funkcje .value
    bSubject.subscribe(console.log);
    bSubject.next({ id: 2 });
    console.log(bSubject.getValue());*/

    /* const rs = new ReplaySubject();
    rs.next(1);
    rs.next(2);
    rs.next(3);

    rs
    .pipe(
      // take(3),
      // reduce((acc, item) => acc + item, 0)
      scan((acc, item) => acc + item, 0)
    )
    .subscribe(console.log); // W replaySubject suscribe mozemy dac na koniec, pamieta wszystkie, w behavior ostatni element */

  } 
  operatorsFiltering() {
   /*  interval(1000)
    .pipe(
      filter(val => val  % 2 === 0), //filtruje co drugi - chce funckje 
      takeWhile(val => val < 5), // wypisuje mniejsze od 5 - chce funkcje
      takeUntil(fromEvent(document, 'click')), // dopoki cos sie nie stanie, np.klikniecie - chce obiekt observable
      take(5) //bierze 5 wartosci - chce number
    )
    .subscribe(console.log, null, () => console.warn('comp')) //wypisuje po zakończeniu, po wypisaniu 5 wartosci */
  }
  operatorsTransformation() {
       /*  of({name:"joe"})
    .pipe(
        map((value)=>{
          return {...value, date: Date.now()} //... (trzy kropki) to spread operator, kopiuje wartosc value(stara) i pozniej doklejamy date, i tworzy nowy
        })
    )
    .subscribe(console.log) */
  }
  operatorsCombination() {
     /* merge(
      fromEvent(document, 'click'),
      fromEvent(document, 'mousemove')
    ).subscribe(({type, clientX} : any) => { //destrukturyzacja obiektu, wyciagamy type i clientX z obiektu val, zamiast uzywania val.type, val.clientX
      console.log(type, clientX)
    })  */

    /* forkJoin(
      ajax('https:/api.debugger.pl/items'),
      ajax('https:/api.debugger.pl/workers')
    )
    .pipe(
      catchError((err)=>{
        console.warn('masz error', err);
        return throwError(err);
      })
    )
    .subscribe(
        ([items, workers])=>{
          console.log(items, workers);
        }
      ) */

  }
  hotvscold() {
    //przy hot dane są tworzone na zewnątrz, jak singleton
    //przy cold za kazdym razem tworzymy
/* 
    const req$ = ajax('https:/api.debugger.pl/items').pipe(share()) //dzieki share raz sie wywola request
    req$.subscribe(console.log) //za kazda subskrypcja uruchamiamy procedure stworzenia nowego obiektu, to przy observable
    req$.subscribe(console.log) // 2 raz sie wywoła
    req$.subscribe(console.log) */
  }
  higherOrder() {
    /* of(1,2,3)
    .pipe(delay(3000))
    .subscribe(console.log) //wyswietli wszystko naraz po 3s */


    /* //zagniezdzone observable
    of(1,2,3)
    .pipe(
      map((val)=>of(val).pipe(delay(1000))), //wypisuje co 1s
      concatAll() //subskrybujemy to observable val
      )
    .subscribe(console.log)  */


    const urls = [
      'https://api.debugger.pl/big-deal/10000',
      'https://api.debugger.pl/big-deal/1000000',
      'https://api.debugger.pl/big-deal/1'
      ];
      
      
      from(urls)
      .pipe(
      map(url => ajax(url)),
      // concatAll(), //wykonuje po kolei te requesty, czeka na koniec 1, wtedy uruchamia 2, na koniec 3
      // mergeAll(), //wykonuje jednocześnie, wyswietli najpier 1, potem 1000, potem 1000000, najprawdopodbniej, wyscig szczurow, ktory pierwszy to wyswietla
      switchAll() //przełącza sie na kolejne, pierwsze 2 zostaly skanselowane, wykona sie deal/1
      )
      .subscribe(({ response }) => console.log(response))
    
  }
  customOperator() {
    throw new Error("Method not implemented.");
  }
  helloWorld() {
    const text = 'hello world!';
    console.log("hello");
    from(text.split(''))
    .pipe(
      filter((val) => !!val.trim()), //usuwa spacje
      map((val)=>of(val).pipe(delay(1000))), //wypisuje co 1s
      concatAll(), //subskrybujemy to observable val
      )
    .subscribe(console.log)
  }
  mousemoveAndClickCount() {
    throw new Error("Method not implemented.");
  }
  notifications() {
    throw new Error("Method not implemented.");
  }
  observableAndObserver() {
/*     interval(1000)
    .subscribe(console.log) */

/*     of('hello')
    .subscribe(
      console.log,
      console.warn,
      ()=>console.log('complete')
      ); */

      /* fromEvent(document, 'mousemove')
      .subscribe(console.log); */

     /*  from([1,2,3])
      .subscribe(console.log) */


  }
  title = 'rxjs';
  constructor(private http: HttpClient) {
    //     this.observableAndObserver();
    //     this.createObservable();
    //     this.createSubject();
    //     this.operatorsFiltering();
    //     this.operatorsTransformation();
    //     this.operatorsCombination();
    //     this.hotvscold();
    //     this.higherOrder()
    //     this.customOperator();
    //     // tasks
    //     this.helloWorld();
    //     this.mousemoveAndClickCount();
    //     this.notifications();
    this.createForm()


    //bindowanie
    /* 
        const obj = {
      name: 'jpoe',
      showName(){
        console.log(this.name);
      }
    }
    const fn = obj.showName;

    fn.bind(obj)(); 
    */
      }
}
