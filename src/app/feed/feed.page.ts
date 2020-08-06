import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { UserService } from '../user.service';
export interface MyData {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  // Upload Task 
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  images: Observable<MyData[]>;

  //File details  
  fileName: string;
  fileSize: number;

  //Status check 
  isUploading: boolean;
  isUploaded: boolean;

  userr: string;

  private imageCollection: AngularFirestoreCollection<MyData>;
  myinput: string;

  constructor(
    private storage: AngularFireStorage,
    private database: AngularFirestore,

    private user: UserService,
  ) {
    this.isUploading = false;
    this.isUploaded = false;
    //Set collection where our documents/ images info will save

    this.userr = this.user.getUID()
    this.imageCollection = database.collection('users').doc(this.userr).collection<MyData>('Posts');
    this.images = this.imageCollection.valueChanges();
  }

  ngOnInit() {
  }
  uploadFile(event: FileList) {
  
  
    
    // The File object
    const file = event.item(0)
  
    //const blog = event.item(1)
  
    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
     console.error('unsupported file type :( ')
     return;
    }
  
    this.isUploading = true;
    this.isUploaded = false;
  
  
    //this.date = firestore.Timestamp.now();
    this.fileName = file.name;
  
    // The storage path
    const path = `images/${new Date().getTime()}_${file.name}`;
  
    // Totally optional metadata
    const customMetadata = { app: 'Students Connect' };
  
    //File reference
    const fileRef = this.storage.ref(path);
  
    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });
  
    
     
    
  
    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
        
        this.UploadedFileURL.subscribe(resp=>{
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize,
          });
          this.isUploading = false;
          this.isUploaded = true;
        },error=>{
          console.error(error);
        })
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    )
  }
  
  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();
    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }
  

}