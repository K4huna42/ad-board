import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'russianDate' })
export class RussianDatePipe implements PipeTransform {
    private months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    transform(value: string | Date): string {
        if (!value) return '';

        const date = new Date(value);
        const day = date.getDate();
        const month = this.months[date.getMonth()];
        let result = `${day} ${month}  `;
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        result += ` ${ hours }:${ minutes }`;
        return result;
    }
}