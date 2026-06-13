export function extractPublicId(url, folder = 'Per_ankh') {
  const filename = url.split('/').pop().split('.')[0];
  return `${folder}/${filename}`;
}