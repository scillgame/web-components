import { Pipe, PipeTransform } from '@angular/core';
import en from '../../assets/i18n/en.json';
import de from '../../assets/i18n/de.json';
@Pipe({
  name: 'getTranslation'
})


export class GetTranslationPipe implements PipeTransform {
  transform(value: string, locale = 'en'): unknown {
    if (locale === 'en'){
      return en[value] || value;
    }
    if (locale === 'de'){
      return de[value] || value;
    }
  }
}
