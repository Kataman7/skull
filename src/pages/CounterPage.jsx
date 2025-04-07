import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { counterActions } from '../lib/store/slices/counterSlice.js';
import { useParams } from 'react-router-dom';
import Button from '../components/atoms/button.jsx';

const CounterPage = () => {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();
  const { value } = useParams();
  const parsedValue = value ? Number(value) : 0;

  useEffect(() => {
    if (!isNaN(parsedValue)) {
      dispatch(counterActions.setValue(parsedValue));
    }
  }, [dispatch, parsedValue]);

  return (
    <div>
      <h1>Compteur: {count}</h1>

      <Button
        label="Incrémenter"
        onClick={() => dispatch(counterActions.increment())}
      />
      <Button
        label="Décrémenter"
        onClick={() => dispatch(counterActions.decrement())}
      />
      <Button
        label="Réinitialiser"
        onClick={() => dispatch(counterActions.setValue(parsedValue))}
      />
    </div>
  );
};

export default CounterPage;
