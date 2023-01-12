import Head from 'next/head'
import Message from '../components/message'
import { useEffect, useState } from 'react'
import { db } from '../utils/firebase'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';
import Login from './auth/login';
import Dashboard from './dashboard';

export default function Home() {

  const [allPosts, setAllPosts] = useState([]);
  
  const {user} = useAuth()

  const getPosts = async () => {
    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id })));
    })
    return unsubscribe;
  }

  useEffect(() => {
    getPosts();
  }, [])

  return (
    <div>
      <Head>
        <title>Blogging Your Mind</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* {!currentUser && <Login />} */}
      <div className='my-12 text-lg font-medium'>
        <h2 className='text-2xl'>Latest Posts</h2>
        {allPosts.map(post => 
        <Message key={post.id} {...post}>
          <Link href={{pathname: `/${post.id}`, query: {...post}}}>
            <button className='text-sm text-gray-500'>{post.comments?.length > 0 ? post.comments?.length : 0} Comments</button>
          </Link>
        </Message>)}
        {/* {currentUser && <Message /> } */}
      </div>
    </div>
  )
}
