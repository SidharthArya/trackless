import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getFirestore,
     initializeFirestore,
      persistentMultipleTabManager, 
      persistentLocalCache, 
      orderBy,
      onSnapshot,
      limit,
      doc, 
      getDoc, 
      getDocs,
      setDoc,
      query, 
      collection } from "@firebase/firestore";
import { log } from './logging.mts';
import { firebaseConfig } from "../config";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = initializeFirestore(app, {localCache: 
    persistentLocalCache({tabManager: persistentMultipleTabManager()})
  });

const SERVICE = "Database"



export const login = (email: string, password: string) => {
    let user = {};
    signInWithEmailAndPassword(auth, email, password).then((u: any)=> {
    localStorage.setItem('user', JSON.stringify(u));
    user = u.user;
    }).catch((error: Error)=>{
        log(SERVICE, 'Error Logging In');
    })
    return user;
};
// Collections
export const getCollectionsAsync = (user: any, path: string, fn: any, nodata: boolean = false) => {
    let args: any[] = [db, type, user.uid, ...path.split('/')]
    getDocs(collection.apply(null, args)).then((docs)=>{
        let dd: any[] = [];
        docs.forEach((doc)=>{
            if (nodata) {
                fns.forEach((fn)=> fn(doc));
            }
            else {
                let d = doc.data();
                fns.forEach((fn)=> fn(d, doc));
            }
        })
        return dd;
      })
}


// Documents
export const getDocumentsAsync = (user: any, type: string, path: string, fns: any, docids: boolean = true, lim: number = -1, order: string[] = [], nosnapfn: any=null) => {
    let args: any[] = [db, type, user.uid, ...path.split('/')]
    const colRef = collection.apply(null, args);
    let args2: any[] = [colRef]
    if (lim >= 1)
        args2.push(limit(lim))
    if (order.length > 0)
        args2.push(orderBy.apply(null, order))

    function callback(snapshot){
        let docs = [];
        if (!snapshot.empty) snapshot.forEach((doc)=> {
            if(docids) 
                docs.push(doc);
            else {
                const d = doc.data();
                let dd = d;
                dd.id = doc.id;
                docs.push(dd);
            } 
        })
        else if (nosnapfn) nosnapfn();
        fns.forEach((fn)=> {docs = fn(docs)});
    }


    onSnapshot(query.apply(null, args2), callback)


    // onSnapshot(query((snapshot)=>{
    // getDocs().then((docs)=>{
    //     let dd: any[] = [];
    //     docs.forEach((doc)=>{
    //         if (nodata) {
    //             fns.forEach((fn)=> fn(doc));
    //         }
    //         else {
    //             let d = doc.data();
    //             fns.forEach((fn)=> fn(d, doc));
    //         }
    //     })
    //     return dd;
    //   })
// }
}


export const getDocumentAsync = async (user: any, type: string, path: string, fns: any[]) => {
    let args: any[] = [db, type, user.uid, ...path.split('/')]
    let document = await getDoc(doc.apply(null, args));
    let data = await document.data();
    fns.forEach((fn)=> fn(data))
}

export const setDocumentAsync = async (user:any, type: string, path: string, value: any, donefn=undefined, errorfn=undefined) => {
    let args: any[] = [db, type, user.uid, ...path.split('/')]
    setDoc(doc.apply(null, args), value)
    .then((a)=> donefn && donefn()).catch((e)=> errorfn && errorfn());
}