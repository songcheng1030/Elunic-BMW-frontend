import { environment } from 'src/environments/environment';
import { RawEditorSettings } from 'tinymce';

export const EDITOR_SETTINGS: RawEditorSettings = {
  menubar: false,
  branding: false,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount',
    'table autoresize',
  ],
  toolbar:
    'undo redo | formatselect | bold italic backcolor | \
    alignleft aligncenter alignright alignjustify | \
    table bullist numlist outdent indent | removeformat | help',
  base_url: environment.tinymceUrl,
  suffix: '.min',
  images_file_types: 'jpg,png',
  statusbar: false,
  paste_data_images: true,
  automatic_uploads: false,
  width: '100%',
  min_height: 200,
  max_height: 550,
};
