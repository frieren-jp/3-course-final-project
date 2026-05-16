import { Link } from "react-router-dom";

function PlantCard({ plant }) {
  const previewImage = plant.images?.[0] || plant.image;

  return (
    <article className="plant-card glass">
      <div className="plant-image" aria-hidden="true">
        {previewImage ? (
          <img src={previewImage} alt={plant.name} loading="lazy" />
        ) : (
          <span>Фото</span>
        )}
      </div>

      <div className="plant-content">
        <h3>{plant.name}</h3>
        <p className="latin">{plant.latinName}</p>
        <ul>
          <li>Регион: {plant.region}</li>
          <li>Редкость: {plant.rarity}</li>
          <li>Тип: {plant.type}</li>
        </ul>
        <Link className="btn-primary small" to={`/catalog/${plant.slug}`}>
          Читать
        </Link>
      </div>
    </article>
  );
}

export default PlantCard;
