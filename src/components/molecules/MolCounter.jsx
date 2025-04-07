import { useDispatch } from "react-redux"
import AtmButton from "../atoms/AtmButton"

const MolCounter = ({ name, handler, value, resetValue = 0 }) => {
    const dispatch = useDispatch()

    return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h1 className="text-xl font-bold mb-2">{name}: {value}</h1>

      <div className="flex gap-2">
        <AtmButton
          label="Incrémenter"
          onClick={() => dispatch(handler.increment())}
        />
        <AtmButton
          label="Décrémenter"
          onClick={() => dispatch(handler.decrement())}
        />
        <AtmButton
          label="Réinitialiser"
          onClick={() => dispatch(handler.setValue(resetValue))}
        />
      </div>
    </div>
  )
}

export default MolCounter