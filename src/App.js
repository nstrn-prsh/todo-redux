import Header from './components/header/Header';
import TodoList from './components/todos/TodoList';
import Footer from './components/footer/Footer';

function App() {
     return (
          <div className='App'>
               <main>
                    <section className='medium-container'>
                         <h2>Todos</h2>
                         <div className='todoapp'>
                              <Header />
                              <TodoList />
                              <Footer />
                         </div>
                    </section>
               </main>
          </div>
     );
}

export default App;
