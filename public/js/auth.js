import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zdilnbfvvqbqckichnsj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkaWxuYmZ2dnFicWNraWNobnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwOTk3NjQsImV4cCI6MjAzMjY3NTc2NH0.mcOLAzGDLBV-ZUxXEBKdU1bV7q0c5AhgWQnKNYDAKFs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function signUp(email, password) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) console.error('Sign up error:', error.message);
    else console.log('User signed up successfully');
}

async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error('Sign in error:', error.message);
    else console.log('User signed in successfully');
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign out error:', error.message);
    else console.log('User signed out successfully');
}

async function signUp(email, password) {
    const { user, session, error } = await supabase.auth.signUp({ email, password });
    if (error) console.error('Sign up error:', error);
    else console.log('User signed up:', user);
}

async function signIn(email, password) {
    const { user, session, error } = await supabase.auth.signIn({ email, password });
    if (error) console.error('Sign in error:', error);
    else console.log('User signed in:', user);
}

document.getElementById('sign-out').addEventListener('click', signOut);
