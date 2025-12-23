import Image from 'next/image';
import React from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({icon, alt, label} : {icon: string; alt: string; label: string}) => {
  <div className='flex flex-row gap-2 items-center'>
    <Image src={icon} alt={alt} width={17} height={17}/>
    <p>
      {label}
    </p>
  </div>
};

const EventAgenda = ({agendaItems} : {agendaItems: string[]}) => {
  <div className='agenda'>
    <h2>Agenda</h2>

    <ul>
      {agendaItems.map((item) => (
        <li key={item}>
          {item}
        </li>
      ))}
    </ul>
  </div>
};

const EventTags = ({tags} : {tags: string[]}) => {
  <div className='flex flex-row gap-1.5 flex-wrap'>
    {tags.map((tag) => (
      <div className='pill' key={tag}>
        {tag}
      </div>
    ))}
  </div>
}

const EventDetails = () => {
  return (
    <div>EventDetails</div>
  )
}

export default EventDetails