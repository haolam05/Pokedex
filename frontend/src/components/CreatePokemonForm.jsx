import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPokemon, getPokemonTypes } from '../store/pokemon';
import ErrorMessage from './ErrorMessage';

const CreatePokemonForm = ({ hideForm }) => {
  const pokeTypes = useSelector(state => state.pokemon.types);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [number, setNumber] = useState(1);
  const [attack, setAttack] = useState('');
  const [defense, setDefense] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState(pokeTypes[0]);
  const [move1, setMove1] = useState('');
  const [move2, setMove2] = useState('');
  const [errors, setErrors] = useState({});

  const updateNumber = (e) => setNumber(e.target.value);
  const updateAttack = (e) => setAttack(e.target.value);
  const updateDefense = (e) => setDefense(e.target.value);
  const updateImageUrl = (e) => setImageUrl(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updateType = (e) => setType(e.target.value);
  const updateMove1 = (e) => setMove1(e.target.value);
  const updateMove2 = (e) => setMove2(e.target.value);

  useEffect(() => {
    dispatch(getPokemonTypes());
  }, [dispatch]);

  useEffect(() => {
    if (pokeTypes.length && !type) {
      setType(pokeTypes[0]);
    }
  }, [pokeTypes, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      number,
      attack,
      defense,
      imageUrl,
      name,
      type,
      move1,
      move2,
      moves: [move1, move2]
    };

    try {
      let createdPokemon = await dispatch(createPokemon(payload));
      if (createPokemon) {
        navigate(`/pokemon/${createdPokemon.id}`);
        hideForm();
      }
    } catch (e) {
      setErrors(e.errors);
      console.error(errors);
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    hideForm();
  };

  return (
    <section className="new-form-holder centered middled">
      <form className="create-pokemon-form" onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Number"
          min="1"
          required
          value={number}
          onChange={updateNumber} />
        {errors.number && <ErrorMessage label={'number'} message={errors.number} />}
        <input
          type="number"
          placeholder="Attack"
          min="0"
          max="100"
          required
          value={attack}
          onChange={updateAttack} />
        {errors.attack && <ErrorMessage label={'attack'} message={errors.attack} />}
        <input
          type="number"
          placeholder="Defense"
          min="0"
          max="100"
          required
          value={defense}
          onChange={updateDefense} />
        {errors.defense && <ErrorMessage label={'defense'} message={errors.defense} />}
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={updateImageUrl} />
        {errors.imageUrl && <ErrorMessage label={'imageUrl'} message={errors.imageUrl} />}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={updateName} />
        {errors.name && <ErrorMessage label={'name'} message={errors.name} />}
        <input
          type="text"
          placeholder="Move 1"
          value={move1}
          onChange={updateMove1} />
        {errors.move1 && <ErrorMessage label={'move1'} message={errors.move1} />}
        <input
          type="text"
          placeholder="Move 2"
          value={move2}
          onChange={updateMove2} />
        {errors.move2 && <ErrorMessage label={'move2'} message={errors.move2} />}
        <select onChange={updateType} value={type}>
          {pokeTypes.map(type =>
            <option key={type}>{type}</option>
          )}
        </select>
        {errors.type && <ErrorMessage label={'type'} message={errors.type} />}
        <button type="submit">Create new Pokemon</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </form>
    </section>
  );
};

export default CreatePokemonForm;
