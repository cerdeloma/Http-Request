import { 
  HttpClient, 
  HttpEventType, 
  HttpHeaders, 
  HttpParams 
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject, throwError } from 'rxjs';
import { 
  map, 
  catchError, 
  tap 
} from 'rxjs/operators';

import { Post } from './post.model'


@Injectable({providedIn: 'root'})
export class PostsService {
  error = new Subject<string>();

    constructor(private http: HttpClient){}


    createAndStorePost(title: string, subtitle: string, content:string){
        const postData: Post = {title: title, subtitle: subtitle, content: content}
        this.http.post<{ name: string }>(
            'URL da api do firebase, no final add um /posts.json',
            postData,
            {
              observe: 'response',
              responseType: 'json'
            }
        )
        .subscribe(responseData => {
        console.log(responseData)
        }, 
        error => {
          this.error.next(error.message)
        })   
    }

    fetchPosts(){
        // para adicionar vários paramsHttp
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty')
        searchParams = searchParams.append('custom', 'key') // and so on

        return this.http.get<{ [key: string]: Post }>(
            'URL da api do firebase, no final add um /posts.json',
            {
              headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
              params: searchParams,
              responseType: 'json'
              //para adicionar um paramHttp
              // params: new HttpParams().set('print', 'pretty')
            }
          )
          .pipe(
            map(responseData => {
              const postsArray: Post[] = [];
              for (const key in responseData) {
                if(responseData.hasOwnProperty(key)) { 
                postsArray.push({ ...responseData[key],
                  id: key });
              }
            };
            return postsArray;
          }),
          catchError(errorRes =>{
            // Send to analytics server
            return throwError(errorRes);
          })
          )
    }

    deletePosts(){
        return this.http.delete(
            'URL da api do firebase, no final add um /posts.json',
            {
              observe: 'events'
            }
          ).pipe(
            tap(event =>{
              console.log(event);
              if(event.type === HttpEventType.Sent){
                // ...
              }
              if(event.type === HttpEventType.Response){
                console.log(event.body);
              }
            })
          )
        };


};