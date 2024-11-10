import { Pipe, PipeTransform } from "@angular/core";
import { BlogPost } from "../interfaces/blog-post.interface";

@Pipe({name: 'filter', standalone: true})
export class FilterPipe implements PipeTransform {
    public transform(value: BlogPost[], searchValue: string): BlogPost[] {
        return value.filter((post: BlogPost) => post.text.toLowerCase().includes(searchValue.toLowerCase()));
    }

}