import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sgTrustHtml',
})
export class TrustHtmlPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) { }
    transform(html: string, args: any[]): any {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(html);
    }
}